import z from "zod";


export type ActionResponse<T> = ActionSuccess<T> | ActionError<T>;
type ActionSuccess<T> = {
  data: T;
  success: true;
};
type ActionError<T> = {
  errors: T;
  success: false;
};


export const validate = async function <ActionInput>(
  formData: FormData,
  schema: z.ZodObject,
) {

  try {
    // const formData = await request.formData();
console.log(Object.fromEntries(formData), 'form data utils');
    const data = schema.parse(Object.fromEntries(formData)) as ActionInput;

    return {
      data: data,
      success: true,
    } as ActionResponse<ActionInput>;
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.issues.map(({ path, message }) => {
        return { [String(path)]: { message } };
      });
      const errorsObj = errors.reduce((acc, curr) => {
        const key = Object.keys(curr)[0]; // e.g., "password"
        acc[key] = curr[key].message; // extract the message
        return acc;
      }, {});
      return {
        errors: errorsObj,
        success: false,
      } as ActionResponse<ActionInput>;
    }
  }
};