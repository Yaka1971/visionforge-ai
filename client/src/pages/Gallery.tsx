import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Trash2, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Gallery() {
  const { user } = useAuth();
  const [offset, setOffset] = useState(0);
  const [allGenerations, setAllGenerations] = useState<any[]>([]);

  const { data: historyData, isLoading, refetch } = trpc.generation.getHistory.useQuery(
    { limit: 20, offset },
    { enabled: !!user }
  );

  const deleteMutation = trpc.generation.deleteGalleryItem.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (historyData?.generations) {
      setAllGenerations((prev) =>
        offset === 0 ? historyData.generations : [...prev, ...historyData.generations]
      );
    }
  }, [historyData, offset]);

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      setAllGenerations((prev) => prev.filter((item) => item.generationId !== id));
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete image.");
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <ImageIcon className="text-blue-500" size={32} />
            Gallery
          </h1>
          <p className="text-gray-400">
            View and manage all your generated images and videos
          </p>
        </motion.div>

        {/* Gallery Grid */}
        {allGenerations.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {allGenerations.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden aspect-square">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt="Gallery item"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <div className="text-xs text-gray-300">
                      <p className="font-semibold truncate">
                        {item.style || "Generated Image"}
                      </p>
                      <p className="text-gray-500 text-[10px]">
                        {(() => {
                          try {
                            const meta = JSON.parse(item.metadata || "{}");
                            return `${meta.resolution || "4K"} • ${new Date(item.createdAt).toLocaleDateString()}`;
                          } catch {
                            return new Date(item.createdAt).toLocaleDateString();
                          }
                        })()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 text-xs"
                        onClick={() =>
                          handleDownload(
                            item.imageUrl,
                            `visionforge-${item.id}.png`
                          )
                        }
                      >
                        <Download size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 text-xs"
                        onClick={() => handleDelete(item.generationId)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin mb-4">
                <ImageIcon size={48} className="text-gray-500" />
              </div>
              <p className="text-gray-400">Loading gallery...</p>
            </div>
          </div>
        ) : (
          <Card className="bg-slate-900/50 border-slate-700/50 p-12 text-center">
            <ImageIcon size={48} className="mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 mb-4">Your gallery is empty</p>
            <p className="text-sm text-gray-500">
              Start generating images to build your collection
            </p>
          </Card>
        )}

        {/* Load More Button */}
        {allGenerations.length > 0 && historyData?.generations?.length === 20 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setOffset((prev) => prev + 20)}
              variant="outline"
              className="border-slate-700"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
