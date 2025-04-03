import { v4 as uuidv4 } from 'uuid';
const imageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/svg', 'image/webp'];

export const fileCheck = (req, res, next) => {

  const file = req.files?.image;
  if (!file) return res.status(400).json({ message: 'image is required' });
  if (!imageTypes.includes(file.mimetype)) return res.status(400).json({ message: 'please provide a valid image' });
  const imagePath = `/${uuidv4()}-${file.name}`;

  file.mv(`./uploads${imagePath}`, (err) => {
    if (err) return res.status(400).json({ message: `${err}` });
    req.imagePath = imagePath;
    return next();
  });


}



export const updateFileCheck = (req, res, next) => {

  const file = req.files?.image;
  if (!file) return next();

  if (!imageTypes.includes(file.mimetype)) return res.status(400).json({ message: 'please provide a valid image' });
  const imagePath = `/${uuidv4()}-${file.name}`;

  file.mv(`./uploads${imagePath}`, (err) => {
    if (err) return res.status(400).json({ message: `${err}` });
    req.imagePath = imagePath;
    return next();
  });



}