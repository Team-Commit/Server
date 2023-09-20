class UserService {
  private static instance: UserService;

  userService: UserService;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
}

export default UserService;
