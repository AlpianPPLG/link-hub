# Contributing to Link Hub

First off, thank you for considering contributing to Link Hub! We appreciate your time and effort.

## Code of Conduct

This project adheres to the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

1. **Check Existing Issues**: Before creating a new issue, please check if a similar issue already exists.
2. **Create an Issue**: If you find a bug, please create a new issue with a clear title and description.
3. **Be Specific**: Include steps to reproduce, expected behavior, and actual behavior.

### Suggesting Enhancements

1. **Check Existing Suggestions**: Look for similar enhancement requests.
2. **Create an Issue**: Describe the enhancement and why it would be valuable.
3. **Be Detailed**: Include examples, mockups, or any relevant information.

### Your First Code Contribution

1. **Fork the Repository**
2. **Create a Branch**: 
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Your Changes**
4. **Run Tests**: Ensure all tests pass
5. **Commit Your Changes**: 
   ```bash
   git commit -m "feat: add your feature"
   ```
6. **Push to Your Fork**: 
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

## Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/link-hub.git
   cd link-hub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Ensure tests pass
3. Add tests for new features
4. Update documentation if necessary
5. Ensure your code follows the style guide
6. Request a code review

## Style Guide

- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Write tests for new features

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
