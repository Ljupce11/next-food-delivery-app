import ProfileInfo from "@/app/ui/(main)/profile-info";
import ProfileSettings from "@/app/ui/(main)/profile-settings";

import { auth } from "../../../../auth";

export default async function ProfilePage() {
  const authData = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your account preferences and settings</p>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <ProfileInfo user={authData?.user} />
            <div className="border-t border-gray-100">
              <ProfileSettings />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
