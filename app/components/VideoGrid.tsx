import { FC } from "react";

interface Video {
  id: number;
  title: string;
  category: string;
  url: string;
  comments: string;
  store: {
    name: string;
    address: string;
  };
}

interface VideoGridProps {
  session?: any;
}

const VideoGrid: FC<VideoGridProps> = () => {
  const videos: Video[] = [
    {
      id: 2,
      title: "Video de zapatos",
      category: "Zapatos",
      url: "https://res.cloudinary.com/dhnkojapo/video/upload/v1730321490/samples/cld-sample-video.mp4",
      comments: "Zapatos de moda",
      store: { name: "De zapatos", address: "Calle 456, Ciudad" },
    },
    {
      id: 3,
      title: "Video de relojes",
      category: "Relojes",
      url: "https://res.cloudinary.com/dhnkojapo/video/upload/v1730321490/samples/cld-sample-video.mp4",
      comments: "Relojes de alta calidad",
      store: { name: "De relojes", address: "Calle 789, Ciudad" },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
        >
          <div className="relative aspect-[9/16] w-full">
            <video
              src={video.url}
              controls
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
            />
          </div>
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1">
                {video.title}
              </h2>
              <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
                {video.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {video.comments}
            </p>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                  {video.store.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {video.store.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {video.store.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;