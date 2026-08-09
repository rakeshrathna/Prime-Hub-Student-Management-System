import PageHeader from "../../components/common/PageHeader";
import AnnouncementsBoard from "../../components/shared/AnnouncementsBoard";
import { useAuth } from "../../context/AuthContext";

export default function TeacherAnnouncements() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Announcements" description="Post school-wide updates and review past notices." />
      <AnnouncementsBoard canPost posterId={user.id} />
    </>
  );
}
