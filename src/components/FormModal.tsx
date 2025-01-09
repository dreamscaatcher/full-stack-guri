"use client";

import {
  deleteClass,
  deleteExam,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from "../lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

type CurrentState = {
  success: boolean;
  error: boolean;
};

type DeleteAction = (currentState: CurrentState, formData: FormData) => Promise<CurrentState>;

const createPlaceholderAction = (): DeleteAction => {
  return async () => {
    console.log("Delete action not implemented");
    return {
      success: false,
      error: true
    };
  };
};

const deleteActionMap: Record<string, DeleteAction> = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
  // Placeholder delete actions that will show "not implemented" message
  parent: createPlaceholderAction(),
  lesson: createPlaceholderAction(),
  assignment: createPlaceholderAction(),
  result: createPlaceholderAction(),
  attendance: createPlaceholderAction(),
  event: createPlaceholderAction(),
  announcement: createPlaceholderAction()
};

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  class: (setOpen, type, data, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  teacher: (setOpen, type, data, relatedData) => (
    <TeacherForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  student: (setOpen, type, data, relatedData) => (
    <StudentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  exam: (setOpen, type, data, relatedData) => (
    <ExamForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  parent: (setOpen, type) => <div className="p-4 text-center">Parent form coming soon...</div>,
  lesson: (setOpen, type) => <div className="p-4 text-center">Lesson form coming soon...</div>,
  assignment: (setOpen, type) => <div className="p-4 text-center">Assignment form coming soon...</div>,
  result: (setOpen, type) => <div className="p-4 text-center">Result form coming soon...</div>,
  attendance: (setOpen, type) => <div className="p-4 text-center">Attendance form coming soon...</div>,
  event: (setOpen, type) => <div className="p-4 text-center">Event form coming soon...</div>,
  announcement: (setOpen, type) => <div className="p-4 text-center">Announcement form coming soon...</div>
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState<CurrentState, FormData>(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      } else if (state.error) {
        toast.error("Operation failed");
      }
    }, [state, router]);

    if (type === "delete" && id) {
      return (
        <form action={formAction} className="p-4 flex flex-col gap-4">
          <input type="text" name="id" value={id} hidden />
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
            Delete
          </button>
        </form>
      );
    }

    if (type === "create" || type === "update") {
      if (!forms[table]) {
        return (
          <div className="p-4 text-center text-red-500">
            This form type is not yet implemented. Please try again later.
          </div>
        );
      }
      return forms[table](setOpen, type, data, relatedData);
    }

    return "Form not found!";
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
