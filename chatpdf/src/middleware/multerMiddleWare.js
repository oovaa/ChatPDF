import multer from 'multer'

const storage = multer.memoryStorage({
  fileFilter: (req, file, cb) => {
    console.log(file)
    const allowedFiles = ['pptx', 'pdf', 'docx', 'txt']
    if (allowedFiles.includes(file.mimetype.split('/')[1])) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
})

const upload = multer({
  storage,
  // dest: './storage/',
}).single('file')

export default upload
