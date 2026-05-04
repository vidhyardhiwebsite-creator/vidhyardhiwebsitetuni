export default function SkeletonCard() {
  return (
    <div className="bg-[#111] rounded-xl overflow-hidden border border-[#D4AF37]/10 animate-pulse">
      <div className="aspect-square bg-[#1A1A1A]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-[#222] rounded w-1/3" />
        <div className="h-4 bg-[#222] rounded w-3/4" />
        <div className="h-4 bg-[#222] rounded w-1/2" />
        <div className="h-8 bg-[#222] rounded mt-2" />
      </div>
    </div>
  )
}
