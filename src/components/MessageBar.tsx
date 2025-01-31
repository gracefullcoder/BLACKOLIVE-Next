
function MessageBar({ messages }: { messages: string[] }) {

    return (
        <div className="relative overflow-hidden bg-black text-white h-10 flex items-center">
            <style>
                {`
          @keyframes scroll {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
            </style>
            <div className="flex w-full animate-[scroll_10s_linear_infinite] whitespace-nowrap justify-between">
                {messages.map((message, index) => (
                    <div key={index} className="mx-4">
                        {message}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MessageBar