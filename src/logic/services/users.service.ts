import { injectable } from "inversify"
import { UserRepository } from "../../data/user.repository"
import { CreateUserDto } from "../dtos/users/create-user.dto"
import { UserDto } from "../dtos/users/user.dto"
import bcrypt from "bcryptjs"
import { UpdateUserDto } from "../dtos/users/update-user.dto"
import { GetOneUserDto } from "../dtos/users/get-one-user.dto"
import { CouldNotFindUserException } from "../exceptions/could-not-find-user.exception"
import { LoginUserDto } from "../dtos/users/login-user.dto"
@injectable()
export class UserService {
  public constructor(private readonly _userRepo: UserRepository) {}

  public async all() {
    const users = await this._userRepo.all()

    //TODO: zmien users na UserDto i zobacz co sie zmienia
    return UserDto.fromMany(users)
  }

  public async findOne(getOneUserDto: GetOneUserDto) {
    const user = await this._userRepo.findOneById(getOneUserDto.id)
    if (!user) {
      throw new CouldNotFindUserException()
    }
    return UserDto.from(user)
  }
  public async hashPassword(password: string) {
    return await bcrypt.hash(password, bcrypt.genSaltSync(5))
  }
  public async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password)
    const createdUser = await this._userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    })

    return UserDto.from(createdUser)
  }

  public async updateOne(updateUserDto: UpdateUserDto) {
    return this._userRepo.updateOne({
      id: updateUserDto.id,
      email: updateUserDto.email,
      username: updateUserDto.username,
      role: updateUserDto.role,
    })
  }

  public async deleteOne({ id }: GetOneUserDto) {
    await this._userRepo.deleteOne(id)
    return true
  }

  public async verifyPassword(payload: LoginUserDto) {
    const foundUser = await this._userRepo.findByEmail(payload.email)
    if (!foundUser) {
      throw new CouldNotFindUserException()
    }

    return bcrypt.compare(payload.password, foundUser.password)
  }

  public async login(loginUserDto: LoginUserDto) {
    const user = await this.verifyPassword(loginUserDto)

    if(!user){
        throw new Error('Wrong password / email')
    }
    return true
  }
}
