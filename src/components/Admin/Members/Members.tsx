import { Link } from "react-router";

const Members = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Total Members: 12</h2>

        <Link to="/admin/add-member" className="btn btnLink">
          Add Member
        </Link>
      </div>
    </div>
  );
};

export default Members;
