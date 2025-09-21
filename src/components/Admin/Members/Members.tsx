import { useState } from "react";
// (Link was unused after switching to modal edit)
import axiosInstance from "../../../hooks/axiosInstance";
import Swal from "sweetalert2";
import AddMemberForm from "./AddMemberForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Member {
  _id: string;
  FullName: string;
  MembershipType: string;
  Email: string;
  Position: string;
  YearBatch: string;
  PhotoURL?: string;
  createdAt: string;
  Discipline: string;
  updatedAt: string;
}

const Members = () => {
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const queryClient = useQueryClient();

  const {
    data: members = [],
    isLoading,
    isError,
  } = useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await axiosInstance.get("/members/getMembers");
      return res?.data?.members || [];
    },
  });

  const deleteMutation = useMutation<string, unknown, string>({
    mutationFn: async (id: string) =>
      axiosInstance.delete(`/members/deleteMember/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action will permanently delete the member.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteMutation.mutateAsync(id);
        Swal.fire("Deleted!", "Member has been deleted.", "success");
      }
    } catch (err) {
      console.error("Error deleting member:", err);
      Swal.fire("Error", "Failed to delete member.", "error");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl">Total Members: {members.length}</h2>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            placeholder="Search by name or email..."
            aria-label="Search members"
            className="input input-bordered w-full sm:w-64"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedMember(null);
              setShowAdd(true);
            }}
          >
            Add Member
          </button>
        </div>
      </div>

      <div className="mt-4">
        {isLoading && (
          <div className="mb-2 text-sm text-muted">Loading members...</div>
        )}
        {isError && (
          <div className="mb-2 text-sm text-error">Failed to load members</div>
        )}

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Batch</th>
                <th>Discipline</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members
                .filter((m) => {
                  if (!query) return true;
                  const q = query.toLowerCase();
                  return (
                    m.FullName.toLowerCase().includes(q) ||
                    m.Email.toLowerCase().includes(q) ||
                    (m.Discipline || "").toLowerCase().includes(q)
                  );
                })
                .map((member) => (
                  <tr key={member._id}>
                    <td className="flex items-center gap-3">
                      <img
                        src={member.PhotoURL || "/kuic.jpg"}
                        alt={member.FullName}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src = "/kuic.jpg")
                        }
                      />
                      <div>
                        <div className="font-medium">{member.FullName}</div>
                        <div className="text-xs text-muted">
                          {member.MembershipType}
                        </div>
                      </div>
                    </td>
                    <td>{member.Email}</td>
                    <td>{member.YearBatch}</td>
                    <td>{member.Discipline}</td>
                    <td>{member.Position}</td>
                    <td className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowAdd(true);
                        }}
                        className="btn btn-ghost btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="btn btn-error btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-base-100 rounded-md w-full max-w-3xl mx-4 p-6 shadow-lg ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Member</h3>
              <button
                className="btn btn-ghost"
                onClick={() => setShowAdd(false)}
              >
                Close
              </button>
            </div>
            <AddMemberForm
              initialValues={selectedMember || undefined}
              onSuccess={async () => {
                await queryClient.invalidateQueries({ queryKey: ["members"] });
                setShowAdd(false);
                setSelectedMember(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
