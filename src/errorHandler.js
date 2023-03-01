
import { BadRequest } from '@feathersjs/errors';

const errorHandler = (error) => {
  // Validation errors
  if (error.keyword === 'required') {
    throw new BadRequest(error.message, error.params);
  }

  // Response Errors
  if (error.response) {
    console.log(error.response.status);
    console.log(typeof error.response.status);
    // console.log(error.response.data);

    switch (error.response.status) {
      case 400:
        throw new BadRequest(error.message);
      case '500':
        break;
      default:
    }
  } else {
    // console.log(error.message);
    throw new BadRequest(error.message);
  }
};
export default errorHandler;
