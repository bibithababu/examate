import { toast } from 'react-toastify';

export const handleErrorResponse = (error) => {
  if (error?.response?.data?.message) {
    toast.error(error.response.data.message, { autoClose: 2000 });
  } else {
   
    toast.error("Network unable to connect to the server", { autoClose: 2000 });
  }
};