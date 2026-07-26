const PageContainer = ({ children }) => {
  return (
    <main className="flex-1 overflow-y-auto bg-slate-100">
      <div className="mx-auto w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-10 xl:py-8">
        {children}
      </div>
    </main>
  );
};

export default PageContainer;