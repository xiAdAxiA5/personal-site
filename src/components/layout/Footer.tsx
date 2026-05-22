import { GitFork, MessageSquare, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-border-dark transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/yourname" target="_blank" rel="noopener noreferrer"
               className="text-gray-400 hover:text-primary transition-colors">
              <GitFork size={20} />
            </a>
            <a href="https://x.com/yourname" target="_blank" rel="noopener noreferrer"
               className="text-gray-400 hover:text-primary transition-colors">
              <MessageSquare size={20} />
            </a>
            <a href="mailto:hello@example.com"
               className="text-gray-400 hover:text-primary transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
