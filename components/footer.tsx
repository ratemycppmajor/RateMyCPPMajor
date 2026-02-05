export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-2 lg:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 mx-auto">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} RateMyCPPMajor.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Not affiliated or endorsed by Cal Poly Pomona University or California
          State University. 100% Student run project.
        </p>
      </div>
    </footer>
  );
}
