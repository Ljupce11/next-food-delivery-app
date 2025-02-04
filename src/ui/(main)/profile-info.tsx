import type { User } from "next-auth";
import Image from "next/image";

type Props = {
  user?: User;
};

export default function ProfileInfo({ user }: Props) {
  return (
    <div className="px-4 py-6 sm:p-8">
      <div className="flex items-center space-x-8">
        <div className="relative group">
          <div className="relative h-24 w-24">
            <Image
              priority
              width={0}
              height={0}
              sizes="100vw"
              alt="Profile"
              src="/img/user.svg"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              className="rounded-full object-cover h-24 w-24 ring-2 ring-white"
            />
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="text-white text-sm">Change</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium text-gray-900">{user?.name}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <p className="mt-1 text-sm text-gray-500">
            Member since January 2024
          </p>
        </div>
      </div>
    </div>
  );
}
