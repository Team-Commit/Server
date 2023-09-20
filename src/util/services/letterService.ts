class LetterService {
  private static instance: LetterService;

  letterService: LetterService;

  private constructor() {
    this.letterService = LetterService.getInstance();
  }

  public static getInstance(): LetterService {
    if (!LetterService.instance) {
      LetterService.instance = new LetterService();
    }
    return LetterService.instance;
  }
}

export default LetterService;
