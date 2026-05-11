export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E0D5] animate-pulse shadow-sm">
      <div className="aspect-square bg-[#F2EDE6]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-[#E8E0D5] rounded w-1/3" />
        <div className="h-4 bg-[#E8E0D5] rounded w-3/4" />
        <div className="h-4 bg-[#E8E0D5] rounded w-1/2" />
        <div className="h-8 bg-[#E8E0D5] rounded mt-2" />
      </div>
    </div>
  )
}
