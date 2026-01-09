import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api as apiGenerated } from "@/convex/_generated/api";
// @ts-ignore
const api: any = apiGenerated;
import type { Id } from "@/convex/_generated/dataModel";

export function InterviewTracker() {
  const interviews = useQuery(api.interviews.getUserInterviews);
  const addInterview = useMutation(api.interviews.addInterview);
  const deleteInterview = useMutation(api.interviews.deleteInterview);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [rating, setRating] = useState("5");
  const [notes, setNotes] = useState("");
  const [hasSecondInterview, setHasSecondInterview] = useState(false);
  const [secondInterviewDate, setSecondInterviewDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addInterview({
        companyName,
        position,
        interviewDate: new Date(interviewDate).getTime(),
        rating: parseInt(rating),
        notes: notes || undefined,
        hasSecondInterview,
        secondInterviewDate: secondInterviewDate ? new Date(secondInterviewDate).getTime() : undefined,
        status,
      });

      toast.success("Interview added successfully!");
      setIsDialogOpen(false);

      // Reset form
      setCompanyName("");
      setPosition("");
      setInterviewDate("");
      setRating("5");
      setNotes("");
      setHasSecondInterview(false);
      setSecondInterviewDate("");
      setStatus("pending");
    } catch (error) {
      toast.error("Failed to add interview");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (interviewId: Id<"interviews">) => {
    try {
      await deleteInterview({ interviewId });
      toast.success("Interview deleted");
    } catch (error) {
      toast.error("Failed to delete interview");
      console.error(error);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-500";
    if (rating >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      got_second_interview: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      rejected: "bg-red-500/20 text-red-400 border-red-500/30",
      offered: "bg-green-500/20 text-green-400 border-green-500/30",
    };

    const statusLabels: Record<string, string> = {
      pending: "Pending",
      got_second_interview: "2nd Interview",
      rejected: "Rejected",
      offered: "Offered",
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[status] || statusColors.pending}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={item} className="md:col-span-3">
      <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Briefcase className="h-5 w-5 text-primary" />
              Interview Tracker
            </CardTitle>
            <CardDescription className="text-foreground/60">
              Track your interviews and improve with AI-powered tips
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Interview</DialogTitle>
                <DialogDescription>
                  Track your interview experience and get personalized tips
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Google, Microsoft, etc."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Software Engineer, Product Manager, etc."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Interview Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">How did it go? (1-10)</Label>
                    <Select value={rating} onValueChange={setRating}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num >= 8 ? "⭐" : num >= 5 ? "👍" : "😐"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="got_second_interview">Got 2nd Interview</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="offered">Offered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {status === "got_second_interview" && (
                    <div className="space-y-2">
                      <Label htmlFor="secondDate">Second Interview Date</Label>
                      <Input
                        id="secondDate"
                        type="date"
                        value={secondInterviewDate}
                        onChange={(e) => setSecondInterviewDate(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="What went well? What could be improved?"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Interview"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {!interviews || interviews.length === 0 ? (
            <div className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
              <p className="text-foreground/70 mb-4">No interviews tracked yet</p>
              <p className="text-sm text-foreground/60">
                Start tracking your interviews to see your progress and get AI-powered tips
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {interviews.map((interview: any) => (
                <motion.div
                  key={interview._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-foreground">{interview.companyName}</h3>
                        {getStatusBadge(interview.status)}
                      </div>
                      <p className="text-sm text-foreground/70">{interview.position}</p>
                      <div className="flex items-center gap-4 text-xs text-foreground/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(interview.interviewDate).toLocaleDateString()}
                        </span>
                        <span className={`flex items-center gap-1 font-semibold ${getRatingColor(interview.rating)}`}>
                          <Star className="h-3 w-3 fill-current" />
                          {interview.rating}/10
                        </span>
                      </div>
                      {interview.hasSecondInterview && interview.secondInterviewDate && (
                        <p className="text-xs text-blue-400">
                          2nd Interview: {new Date(interview.secondInterviewDate).toLocaleDateString()}
                        </p>
                      )}
                      {interview.notes && (
                        <p className="text-sm text-foreground/80 mt-2 p-2 bg-white/5 rounded">
                          {interview.notes}
                        </p>
                      )}
                      {interview.tips && (
                        <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-xs font-semibold text-primary mb-1">💡 AI Tips:</p>
                          <p className="text-xs text-foreground/80">{interview.tips}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(interview._id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
