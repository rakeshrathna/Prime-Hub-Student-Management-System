import PageHeader from "../../components/common/PageHeader";
import AnnouncementsBoard from "../../components/shared/AnnouncementsBoard";
import { useAuth } from "../../context/AuthContext";

export default function AdminAnnouncements() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Announcements" description="School-wide notices visible to every account." />
      <AnnouncementsBoard canPost posterId={user.id} />
    </>
  );
}
