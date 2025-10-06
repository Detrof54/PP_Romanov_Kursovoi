interface UserProfileProps {
  user: {
    firstname?: string | null;
    surname?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
      <img
        src={user.image ?? "/default-avatar.jpg"}
        alt="user avatar"
        className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-600"
      />
      <h2 className="text-2xl font-semibold mt-4">
        {user.firstname} {user.surname}
      </h2>
      <p className="text-gray-400">{user.email}</p>
      <p className="text-sm text-gray-500 mt-2">Роль: {user.role}</p>
    </div>
  );
}