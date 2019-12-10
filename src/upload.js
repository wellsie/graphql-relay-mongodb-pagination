import { createWriteStream, unlink } from 'fs';
import mkdirp from 'mkdirp';

const UPLOAD_DIR = './uploads';

// ensure directory exists
//
mkdirp.sync(UPLOAD_DIR);

export const storeUpload = async upload => {
  const { createReadStream, filename, mimetype, encoding } = await upload;

  const stream = createReadStream();

  const path = `${UPLOAD_DIR}/${filename}`;
  const file = { filename, mimetype, encoding };

  // Store the file in the filesystem.
  //
  await new Promise((resolve, reject) => {
    stream
      .on('error', error => {
        unlink(path, () => {
          reject(error);
        });
      })
      .pipe(createWriteStream(path))
      .on('error', reject)
      .on('finish', resolve);
  });

  return file;
};
