import PageHeader from "../../components/common/PageHeader";
import AnnouncementsBoard from "../../components/shared/AnnouncementsBoard";

export default function StudentAnnouncements() {
  return (
    <>
      <PageHeader title="Announcements" description="School-wide notices from staff." />
      <AnnouncementsBoard />
    </>
  );
}
