"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createEvent, updateEvent } from "../../lib/actions";
import { eventSchema, EventSchema } from "../../lib/formValidationSchemas";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

type Props = {
  type: "create" | "update";
  setOpen: (open: boolean) => void;
  data?: any;
};

const EventForm = ({ type, setOpen, data }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createEvent : updateEvent,
    {
      success: false,
      error: false,
    }
  );

  const router = useRouter();

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Event has been ${type}d!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error("Something went wrong!");
    }
  }, [state, router, setOpen, type]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input type="text" {...register("id")} defaultValue={data?.id} hidden />
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          {...register("title")}
          defaultValue={data?.title}
          placeholder="Event title"
          className="p-2 border rounded-md"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          defaultValue={data?.description}
          placeholder="Event description"
          className="p-2 border rounded-md"
          rows={4}
        />
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <input
            type="date"
            id="date"
            {...register("date")}
            defaultValue={data?.date}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label htmlFor="startTime" className="text-sm font-medium">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            {...register("startTime")}
            defaultValue={data?.startTime}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label htmlFor="endTime" className="text-sm font-medium">
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            {...register("endTime")}
            defaultValue={data?.endTime}
            className="p-2 border rounded-md"
          />
        </div>
      </div>
      <button className="bg-lamaSky text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"} Event
      </button>
    </form>
  );
};

export default EventForm;
