import React from "react";
import { useForm } from "react-hook-form";
import type { Member } from "../../../data/people";

type FormValues = {
  MemberID?: string;
  FullName: string;
  StudentID?: string;
  Discipline?: string;
  YearBatch?: string;
  Email: string;
  PhoneNumber?: string;
  PhotoURL?: string;
  MembershipType?: string;
  JoinDate?: string;
  EndDate?: string | null;
  Status?: string;
  Position?: string;
  SkillsExpertise?: string;
  ProjectsInvolved?: string;
  EventParticipationCount?: number;
  Bio?: string;
  LinkedIn?: string;
  Twitter?: string;
  Facebook?: string;
  Instagram?: string;
  PersonalWebsite?: string;
};

type Props = {
  onAdd?: (m: Member) => void;
};

const AddMemberForm: React.FC<Props> = ({ onAdd }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      FullName: "",
      StudentID: "",
      Discipline: "",
      YearBatch: "",
      Email: "",
      PhoneNumber: "",
      PhotoURL: "",
      MembershipType: "General",
      JoinDate: new Date().toISOString().slice(0, 10),
      EndDate: "",
      Status: "Active",
      Position: "Member",
      SkillsExpertise: "",
      ProjectsInvolved: "",
      EventParticipationCount: 0,
      Bio: "",
      LinkedIn: "",
      Twitter: "",
      Facebook: "",
      Instagram: "",
      PersonalWebsite: "",
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

  const onSubmit = handleSubmit((data) => {
    const now = new Date().toISOString();
    const member: Member = {
      MemberID:
        data.MemberID || `KUIC-2025-${Math.floor(Math.random() * 900 + 100)}`,
      FullName: data.FullName,
      StudentID: data.StudentID || "",
      Discipline: data.Discipline || "",
      YearBatch: data.YearBatch || "",
      Email: data.Email,
      PhoneNumber: data.PhoneNumber || undefined,
      PhotoURL: data.PhotoURL || undefined,
      MembershipType: data.MembershipType || "General",
      JoinDate: data.JoinDate || undefined,
      EndDate: data.EndDate || null,
      Status: data.Status || "Active",
      Position: data.Position || "Member",
      SkillsExpertise: (data.SkillsExpertise || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      ProjectsInvolved: (data.ProjectsInvolved || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      EventParticipationCount: Number(data.EventParticipationCount) || 0,
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
      CreatedAt: now,
      UpdatedAt: now,
    };

    if (onAdd) onAdd(member);
    else console.log("New member:", member);

    reset();
  });

  return (
    <div>
      <h2 className="text-2xl mb-4">Add New Member</h2>
      <form onSubmit={onSubmit} className="space-y-4">
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

          <div>
            <label htmlFor="Position" className="block text-sm font-medium">
              Position
            </label>
            <select
              id="Position"
              className="select w-full"
              {...register("Position")}
            >
              <option value="Member">Member</option>
              <option value="President">President</option>
              <option value="Vice President">Vice President</option>
              <option value="Treasurer">Treasurer</option>
            </select>
          </div>

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

          <div>
            <label
              htmlFor="SkillsExpertise"
              className="block text-sm font-medium"
            >
              Skills (comma separated)
            </label>
            <input
              {...register("SkillsExpertise")}
              id="SkillsExpertise"
              className="input w-full"
            />
          </div>

          <div>
            <label
              htmlFor="ProjectsInvolved"
              className="block text-sm font-medium"
            >
              Projects (comma separated)
            </label>
            <input
              {...register("ProjectsInvolved")}
              id="ProjectsInvolved"
              className="input w-full"
            />
          </div>

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
            Add Member
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
