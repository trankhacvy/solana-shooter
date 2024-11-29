import { toast } from "sonner";

export class Notifications {
    static success(data: { title: string; message?: string }) {
        toast.success(data.title, {
            description: data.message,
        });
    }
    static error(data: { title: string; message?: string }) {
        toast.error(data.title, {
            description: data.message,
        });
    }
}
