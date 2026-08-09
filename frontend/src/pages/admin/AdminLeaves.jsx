import PageHeader from "../../components/common/PageHeader";
import LeaveApprovalsPanel from "../../components/shared/LeaveApprovalsPanel";

export default function AdminLeaves() {
  return (
    <>
      <PageHeader title="Leave approvals" description="Review and act on pending student leave requests." />
      <LeaveApprovalsPanel />
    </>
  );
}
