import { UserModel } from "../infra/persistance/user-model";
import { LoginUserInput } from "./dtos/create-user-dto";

export const loginUser = async (user: LoginUserInput) => {
  /*   try {*/
  const result = await UserModel.findOne({
    $or: [{ username: user.login }, { email: user.login }],
  }).lean();
  // TO-DO

  //   // result will be null if it doesn't match
  //   if (!result) {
  //     return { success: false, code: notFoundCode };
  //   }
  //
  //   // Defining if the password is valid
  //   const isPasswordValid = await bcrypt.compare(password, result.password);
  //
  //   if (!isPasswordValid) {
  //     return { success: false, code: unauthorizedCode };
  //   }
  //
  //   // If the login is valid a token is created and sent back
  //   const token = await LoginService.generateJWT(result);
  //   return { success: true, code: okCode, token, user: result };
  // } catch (error) {
  //   console.log(error);
  //   return { success: false, code: internalServerErrorCode };
  // }
  //};
};
