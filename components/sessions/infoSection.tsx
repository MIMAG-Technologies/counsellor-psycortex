interface InfoSectionProps {
    title: string;
    content: string;
  }
  
  export function InfoSection({ title, content }: InfoSectionProps) {
    return (
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
          {title}
        </h3>
        <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100">
          <p className={title === "Session ID" ? "text-gray-900 font-mono" : "text-gray-600 text-sm"}>
            {content}
          </p>
        </div>
      </div>
    );
  }