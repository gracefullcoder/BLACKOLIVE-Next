
function MessageBar({ message }: { message: string }) {
    return (
        <div className="w-full bg-black py-1 text-white text-center">{message}</div>
    )
}

export default MessageBar