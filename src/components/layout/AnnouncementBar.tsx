export function AnnouncementBar() {
  const text = process.env.NEXT_PUBLIC_ANNOUNCEMENT_TEXT || "Free shipping on orders over ₹329";
  return (
    <div className="bg-[#DC0218] text-white py-2 px-4 text-xs font-bold tracking-wide text-center">
      {text}
    </div>
  );
}
