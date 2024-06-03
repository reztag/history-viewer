![icon](https://github.com/reztag/history-viewer/assets/107931002/186f636a-71b8-4b80-ad56-534656e7037b)

# History Viewer: A Better Way to Explore Your Browsing History

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Tired of the clunky, feature-limited Chrome history page? History Viewer offers a modern, intuitive, and customizable way to navigate your browsing past.

## Table of Contents

- [Why I made this extension?](#why-i-made-this-extension)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Why I made this extension?
I never really liked my Chrome browser's history page because I require to navigate my browsing history a lot when I research into a rabbit hole my way haha. At many times the inbuilt history page failed to deliver a valid search result even. And there is NO date picker feature. Bookmarks exist but they won't save the history timestamp so that I could jump to that date and analyse my journey.
So, I tried my best with current knowledge to make an extension which does my work, I learned a lot about Manifest and the entire extension making in the process.

## Features
- **Enhanced Navigation**: Easily filter and search your history by date, keyword, website, or even by specific URLs.
- **Simple Interface**: A simple and minimal layout helps to quickly overview history.
- **Customizable Experience**: Tailor the appearance and functionality to your preferences with a range ofsettings.
- **ShepherdJS Guided Tour**: A built-in interactive tutorial helps you get familiar with the extension's features.

## Installation

To install the History Viewer extension locally, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/reztag/history-viewer.git
    cd history-viewer
    ```

2. **Install Dependencies**:
    Ensure you have [Node.js](https://nodejs.org/) installed, then run:
    ```bash
    npm install
    ```
    
> [!NOTE]  
> Alternatively you can skip step 1 and 2 and download the ZIP folder of this project from GitHub.

3. **Load Extension in Chrome**:
    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable "Developer mode" by toggling the switch in the top right corner.
    - Click on "Load unpacked" and select the `history-viewer` directory you cloned/downloaded.

## Usage

Once the extension is loaded, you can access it by clicking on the History Viewer icon in the Chrome toolbar. The extension will provide a guided tour on first use, highlighting its main features and functionalities.

### Guided Tour

The guided tour will walk you through:
- Navigating the history list
- Using the search functionality
- Customizing your view settings

## Contributing
Contributions are aboslutely welcomed 😄! I am not a pro and this was a fun thing to know many things, hence my extension is not perfect.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
