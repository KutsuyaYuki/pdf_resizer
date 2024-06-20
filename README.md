# PDF Compressor

PDF Compressor is a web application that allows users to upload a PDF file and compress it to a smaller size using Ghostscript. If the compressed file ends up larger than the original, the application will inform the user that it cannot be compressed further.

## Prerequisites

- **Node.js** and **npm**: Ensure you have Node.js and npm installed. You can install them on Arch Linux using:

```bash
paru nodejs
paru npm
```

- **Ghostscript**: Ensure Ghostscript is installed on your system:

```bash
paru ghostscript
```

## Installation

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/pdf-compressor.git
cd pdf-compressor
```

2. **Install dependencies**:

```bash
npm install
```

## Usage

1. **Start the server**:

```bash
node server.js
```

2. **Open your browser** and navigate to `http://localhost:3000`.

3. **Upload a PDF file** or use the drag and drop feature to upload.

4. The application will compress the PDF and display the original and compressed file sizes. If the compressed file is larger than the original, you will be notified that the file cannot be compressed further.
