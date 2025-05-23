

const TYPES = {
  UserRepository: Symbol.for("AuthRepository"),

  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),

  CacheService: Symbol.for("CacheService"),
  EmailService: Symbol.for("EmailService"),
  OtpService: Symbol.for("OtpService"),
  PasswordHasher: Symbol.for("PasswordHasher"),
  RedisClient: Symbol.for('RedisClient'),
  TokenService: Symbol.for('TokenService'),
  EmailTransporter: Symbol.for('EmailTransporter'),
};

export default TYPES;
