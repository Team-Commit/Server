import { app } from './app';
import Logger from './util/logger';

const logger = Logger.getInstance();

app.listen(app.get('port'), () => {
	logger.info(`Server is running on port ${app.get('port')}`);
});
