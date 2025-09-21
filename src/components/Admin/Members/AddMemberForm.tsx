import React from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../hooks/axiosInstance";
import Swal from "sweetalert2";

type FormValues = {
  _id?: string;
  FullName: string;
  StudentID?: string;
  Discipline?: string;
  YearBatch?: string;
  Email: string;
  PhoneNumber?: string;
  PhotoURL?: string;
  JoinDate?: string;
  EndDate?: string | null;
  Status?: string;
  Position?: string;
  Bio?: string;
  SocialMedia?: Record<string, string>;
  LinkedIn?: string;
  Twitter?: string;
  Facebook?: string;
  Instagram?: string;
  PersonalWebsite?: string;
};

type Props = {
  fetchMembers?: () => void;
  onSuccess?: () => void;
  initialValues?: Partial<FormValues> | null;
};

const AddMemberForm: React.FC<Props> = ({
  onSuccess,
  fetchMembers,
  initialValues = null,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      FullName: initialValues?.FullName || "",
      StudentID: initialValues?.StudentID || "",
      Discipline: initialValues?.Discipline || "",
      YearBatch: initialValues?.YearBatch || "",
      Email: initialValues?.Email || "",
      PhoneNumber: initialValues?.PhoneNumber || "",
      PhotoURL: initialValues?.PhotoURL || "",
      JoinDate:
        initialValues?.JoinDate || new Date().toISOString().slice(0, 10),
      EndDate: initialValues?.EndDate || "",
      Status: initialValues?.Status || "Active",
      Position: initialValues?.Position || "Member",
      Bio: initialValues?.Bio || "",
      LinkedIn: initialValues?.SocialMedia?.LinkedIn || "",
      Twitter: initialValues?.SocialMedia?.Twitter || "",
      Facebook: initialValues?.SocialMedia?.Facebook || "",
      Instagram: initialValues?.SocialMedia?.Instagram || "",
      PersonalWebsite: initialValues?.SocialMedia?.PersonalWebsite || "",
    },
  });

  const kuDsciplineOptions = [
    "Engineering",
    "Science",
    "Management",
    "Education",
    "Arts",
    "Law",
    "Medical Sciences",
    "Pharmacy",
    "Nursing",
    "Music",
  ];

  const onSubmit = handleSubmit(async (data) => {
    const member: FormValues = {
      FullName: data.FullName,
      Discipline: data.Discipline || "",
      YearBatch: data.YearBatch || "",
      Email: data.Email,
      PhoneNumber: data.PhoneNumber || undefined,
      PhotoURL: data.PhotoURL || undefined,
      JoinDate: data.JoinDate || undefined,
      EndDate: data.EndDate || null,
      Status: data.Status || "Active",
      Position: data.Position || "Member",
      Bio: data.Bio || "",
      SocialMedia: {
        ...(data.LinkedIn ? { LinkedIn: data.LinkedIn } : {}),
        ...(data.Twitter ? { Twitter: data.Twitter } : {}),
        ...(data.Facebook ? { Facebook: data.Facebook } : {}),
        ...(data.Instagram ? { Instagram: data.Instagram } : {}),
        ...(data.PersonalWebsite
          ? { PersonalWebsite: data.PersonalWebsite }
          : {}),
      },
    };

    try {
      // If initialValues provided, treat as edit -> PATCH
      if (initialValues && initialValues._id) {
        const res = await axiosInstance.patch(
          `/members/updateMember/${initialValues._id}`,
          member
        );
        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Member updated",
            text: `${member.FullName} updated.`,
          });
          if (onSuccess) onSuccess();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: res.data.message || "Failed to update member.",
          });
        }
      } else {
        const res = await axiosInstance.post("/members/addMember", member);
        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Member added",
            text: `${member.FullName} has been added successfully.`,
          });
          if (onSuccess) onSuccess();
          if (fetchMembers) fetchMembers();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: res.data.message || "Failed to add member.",
          });
        }
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "An unexpected error occurred.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    } finally {
      reset();
    }
  });

  console.log(initialValues);

  return (
    <div className="overflow-y-auto max-h-[80vh] pr-2">
      <form onSubmit={onSubmit} className="space-y-4">
        {/* name */}
        <div>
          <label htmlFor="FullName" className="block text-sm font-medium">
            Full name
          </label>
          <input
            {...register("FullName", { required: true })}
            id="FullName"
            className="input w-full"
            placeholder="Enter member full name"
          />
          {errors.FullName && (
            <div className="text-sm text-error">Name is required</div>
          )}
        </div>
        {/* email */}
        <div>
          <label htmlFor="Email" className="block text-sm font-medium">
            Email
          </label>
          <input
            {...register("Email", { required: true })}
            type="email"
            id="Email"
            className="input w-full"
            placeholder="Enter member email"
          />
          {errors.Email && (
            <div className="text-sm text-error">Email is required</div>
          )}
        </div>
        {/* discipline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="Discipline" className="block text-sm font-medium">
              Discipline
            </label>

            <select
              id="Discipline"
              className="select w-full"
              {...register("Discipline")}
            >
              {kuDsciplineOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {/* position */}
          <div>
            <label htmlFor="Position" className="block text-sm font-medium">
              Position
            </label>
            <select
              id="Position"
              className="select w-full"
              {...register("Position")}
            >
              <option value="General">General</option>
              <option value="President">President</option>
              <option value="Vice President">Vice President</option>
              <option value="Treasurer">Treasurer</option>
            </select>
          </div>
          {/*  photo */}
          <div>
            <label htmlFor="PhotoURL" className="block text-sm font-medium">
              Photo URL
            </label>
            <input
              {...register("PhotoURL")}
              id="PhotoURL"
              className="input w-full"
            />
          </div>
          {/* phone */}
          <div>
            <label htmlFor="PhoneNumber" className="block text-sm font-medium">
              Phone
            </label>
            <input
              {...register("PhoneNumber")}
              id="PhoneNumber"
              className="input w-full"
            />
          </div>
          {/* year */}
          <div>
            <label htmlFor="YearBatch" className="block text-sm font-medium">
              Year / Batch
            </label>
            <input
              {...register("YearBatch")}
              id="YearBatch"
              className="input w-full"
            />
          </div>
        </div>
        {/* bio */}
        <div>
          <label htmlFor="Bio" className="block text-sm font-medium">
            Bio
          </label>
          <textarea
            {...register("Bio")}
            id="Bio"
            rows={3}
            className="textarea w-full"
          />
        </div>
        {initialValues && (
          <>
            <div>
              <label htmlFor="Status" className="block text-sm font-medium">
                Status
              </label>

              <select
                id="Status"
                className="select w-full"
                {...register("Status")}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Ex-Member">Ex-Member</option>
              </select>
            </div>
          </>
        )}
        {/* social links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="LinkedIn" className="block text-sm font-medium">
              LinkedIn
            </label>
            <input
              {...register("LinkedIn")}
              id="LinkedIn"
              className="input w-full"
            />
          </div>
          <div>
            <label htmlFor="Twitter" className="block text-sm font-medium">
              Twitter
            </label>
            <input
              {...register("Twitter")}
              id="Twitter"
              className="input w-full"
            />
          </div>
          <div>
            <label htmlFor="Facebook" className="block text-sm font-medium">
              Facebook
            </label>
            <input
              {...register("Facebook")}
              id="Facebook"
              className="input w-full"
            />
          </div>
          <div>
            <label htmlFor="Instagram" className="block text-sm font-medium">
              Instagram
            </label>
            <input
              {...register("Instagram")}
              id="Instagram"
              className="input w-full"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="PersonalWebsite"
              className="block text-sm font-medium"
            >
              Website
            </label>
            <input
              {...register("PersonalWebsite")}
              id="PersonalWebsite"
              className="input w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" className="btn btn-primary">
            {initialValues ? "Update Member" : "Add Member"}
          </button>
          <button type="button" className="btn" onClick={() => reset()}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMemberForm;
