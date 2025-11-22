export default function LoadingSpinner({ size = "md", className = "" }) {
    const sizeClasses = {
        sm: "h-5 w-5",
        md: "h-10 w-10",
        lg: "h-14 w-14",
        xl: "h-20 w-20",
    };

    return (
        <div
            className={`flex min-h-[240px] items-center justify-center ${className}`}
        >
            <div className="relative">
                <span
                    className={`block ${sizeClasses[size]} rounded-full border border-transparent bg-gradient-to-tr from-primary-400 via-sky-400 to-fuchsia-500 opacity-70 blur-2xl`}
                ></span>
                <span
                    className={`absolute inset-0 rounded-full border-2 border-transparent bg-[length:200%_200%] bg-gradient-to-r from-primary-400 via-cyan-300 to-violet-500 animate-[spin_1.1s_linear_infinite]`}
                ></span>
                <span className="absolute inset-[6px] rounded-full border border-slate-800 bg-slate-950"></span>
            </div>
        </div>
    );
}
