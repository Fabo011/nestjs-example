export const imageFileFilter = (req:any, file:any, callback:any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files and files with a max size from 2000mb are allowed!'), false);
    }
    callback(null, true);
  };