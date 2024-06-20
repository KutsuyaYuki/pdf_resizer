const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Function to sanitize filenames
const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
};

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const sanitizedFilename = sanitizeFilename(file.originalname);
        cb(null, `${Date.now()}_${sanitizedFilename}`);
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/compress', upload.single('pdfFile'), (req, res) => {
    const inputFilePath = req.file.path;
    const outputFilePath = `uploads/compressed_${path.basename(inputFilePath, path.extname(inputFilePath))}.pdf`;

    const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=72 -dGrayImageResolution=72 -dMonoImageResolution=72 -dColorImageDownsampleType=/Bicubic -dGrayImageDownsampleType=/Bicubic -dMonoImageDownsampleType=/Subsample -dCompressFonts=true -dEmbedAllFonts=true -dSubsetFonts=true -dEncodeMonoImages=true -dEncodeGrayImages=true -dEncodeColorImages=true -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputFilePath} ${inputFilePath}`;

    console.log(`Executing command: ${gsCommand}`);

    exec(gsCommand, (error) => {
        if (error) {
            console.error('Ghostscript error:', error);
            return res.json({ success: false, message: 'Error during compression' });
        }

        fs.stat(inputFilePath, (err, originalStats) => {
            if (err) {
                console.error('File stat error:', err);
                return res.json({ success: false, message: 'Error reading original file size' });
            }

            fs.stat(outputFilePath, (err, compressedStats) => {
                if (err) {
                    console.error('File stat error:', err);
                    return res.json({ success: false, message: 'Error reading compressed file size' });
                }

                // Compare sizes and handle accordingly
                if (compressedStats.size >= originalStats.size) {
                    // If compressed file is not smaller, delete it and inform user
                    fs.unlink(outputFilePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error deleting non-compressed file:', unlinkErr);
                        }
                        res.json({ success: false, message: 'File cannot be compressed further' });
                    });
                } else {
                    res.json({
                        success: true,
                        url: `/${outputFilePath}`,
                        originalSize: originalStats.size,
                        compressedSize: compressedStats.size
                    });
                }
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
