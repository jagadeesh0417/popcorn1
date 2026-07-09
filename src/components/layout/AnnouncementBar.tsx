export function AnnouncementBar() {
  return (
    <div className="bg-[#DC0218] text-white py-2 text-xs font-bold tracking-wide overflow-hidden whitespace-nowrap">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .marquee-text {
          animation: marquee 20s linear infinite;
        }
      `}</style>
      <div className="marquee-text inline-block">
        Free shipping on orders over ₹399 &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp; Free shipping on orders over ₹399 &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp; Free shipping on orders over ₹399 &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp; Free shipping on orders over ₹399
      </div>
    </div>
  );
}
