import mongoose from 'mongoose';
import request from 'supertest';
import dotenv from 'dotenv';
import { app } from '../src/app';
import { v4 } from 'uuid';
import { LetterModel } from '../src/database/models/letter';
import { UserModel } from '../src/database/models/user';

dotenv.config();

describe('API Test', () => {
	beforeAll(async () => {
		const mongoUri = `${process.env.TEST_DATABASE_URL}`;

		const connectOption = {
			user: process.env.TEST_DATABASE_USER,
			pass: process.env.TEST_DATABASE_PASSWORD,
			dbName: process.env.TEST_DATABASE_NAME,
			heartbeatFrequencyMS: 2000,
		};

		await mongoose.connect(mongoUri, connectOption);
	});

	let accessToken: string;

	describe('AUTH API TEST', () => {
		test('[POST] /v1/auth/sign-in', async () => {
			const response = await request(app).post('/v1/auth/sign-in').send({
				deviceId: 'test_deviceId',
			});

			accessToken = response.body.data.accessToken;
		});
	});

	describe('USER API TEST', () => {
		test('[PATCH] /v1/users/me', async () => {
			await request(app)
				.patch('/v1/users/me')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					nickname: 'change nickname',
					sound: false,
					alarm: false,
				})
				.expect({
					data: {
						nickname: 'change nickname',
						point: 3,
						send: 0,
						receive: 0,
						sound: false,
						alarm: false,
					},
				});
		});
	});

	describe('LETTER API TEST', () => {
		describe('[POST] /v1/letters', () => {
			test('[POST] /v1/letters - normal', async () => {
				await request(app)
					.post('/v1/letters')
					.set('Authorization', `Bearer ${accessToken}`)
					.send({
						content: '오늘 하루도 힘내. 너는 충분히 잘 할 수 있어.',
					})
					.expect({ data: true });
			});

			test('[POST] /v1/letters - use slang', async () => {
				await request(app)
					.post('/v1/letters')
					.set('Authorization', `Bearer ${accessToken}`)
					.send({
						content: '오늘 하루도 힘내. 너는 충분히 잘 할 수 있어. 씨발',
					})
					.expect({
						message: 'BAD_REQUEST',
						code: 1201,
						errors: { message: 'Slang word includes in letter' },
					});
			});

			test('[POST] /v1/letters - min length', async () => {
				await request(app)
					.post('/v1/letters')
					.set('Authorization', `Bearer ${accessToken}`)
					.send({
						content: '오늘 하루도 힘',
					})
					.expect({
						message: 'BAD_REQUEST',
						code: 1203,
						errors: 'message too short!',
					});
			});

			test('[POST] /v1/letters - max length', async () => {
				await request(app)
					.post('/v1/letters')
					.set('Authorization', `Bearer ${accessToken}`)
					.send({
						content:
							'미소 짓는 어린이들이 공원에서 놀고 있습니다. 풍선이 하늘로 떠오르고, ' +
							'잔디밭에는 다양한 꽃들이 활짝 피어 있습니다. 그곳에서 친구들과 함께 시간을 보내는 것은 정말 행복한 순간입니다. ' +
							'어린이들은 웃음 소리를 내며 서로의 손을 잡고 뛰어 놀며, 무엇보다도 순수한 친밀감과 사랑을 느낍니다. ' +
							'이런 순간들이 삶을 더 풍요롭고 아름답게 만들어줍니다. 이상 마치겠습니다.',
					})
					.expect({
						message: 'BAD_REQUEST',
						code: 1204,
						errors: 'message too long!',
					});
			});
		});

		let letterUUID: string;
		describe('Create TEST LETTER', () => {
			test('Create Test Letter', async () => {
				const uuid = v4();

				await new LetterModel({
					uuid: uuid,
					user: 'test_user',
					content: '오늘 하루도 힘내. 너는 충분히 잘 할 수 있어.',
					like: 0,
					read: 0,
				}).save();

				letterUUID = uuid;
			});
		});

		describe('[GET] /v1/letters/${letterUUID}', () => {
			test('[GET] /v1/letters/${letterUUID} - normal', async () => {
				await request(app)
					.get(`/v1/letters/${letterUUID}`)
					.set('Authorization', `Bearer ${accessToken}`)
					.expect({
						data: {
							user: 'test_user',
							content: '오늘 하루도 힘내. 너는 충분히 잘 할 수 있어.',
							like: 0,
						},
					});
			});

			test('[GET] /v1/letters/{letterUUID} - letter not found', async () => {
				await request(app)
					.get(`/v1/letters/wrong-letterUUID`)
					.set('Authorization', `Bearer ${accessToken}`)
					.expect({
						message: 'INTERNAL_SERVER_ERROR',
						code: 1200,
						errors: { message: 'Letter not found' },
					});
			});
		});

		describe('[POST] /v1/letters/${letterUUID}/like', () => {
			test('[POST] /v1/letters/${letterUUID}/like - normal', async () => {
				await request(app)
					.post(`/v1/letters/${letterUUID}/like`)
					.set('Authorization', `Bearer ${accessToken}`)
					.expect({ data: true });
			});

			test('[POST] /v1/letters/{letterUUID}/like - letter not found', async () => {
				await request(app)
					.post('/v1/letters/wrong-letterUUID/like')
					.set('Authorization', `Bearer ${accessToken}`)
					.expect({
						message: 'INTERNAL_SERVER_ERROR',
						code: 1200,
						errors: { message: 'Letter not found' },
					});
			});
		});
	});

	afterAll(async () => {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	});
});
