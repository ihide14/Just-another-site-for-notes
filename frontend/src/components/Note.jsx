import { useState } from "react"
import { useNoteContext } from "../context/notesContext"
import { useUserContext } from "../context/userContext"
import noteServices from "../services/notes"
import { useForm } from "react-hook-form"
import { Categories } from "../constants/Categories"

export const Note = ({ note }) => {

    const { user } = useUserContext()
    const { notes, setNotes } = useNoteContext()
    const [isEdit, setIsEdit] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            editedTitle: note.title,
            editedContent: note.content,
            editedImportant: note.important
        }
    })

    const DeleteThis = async (id) => {
        await noteServices.deleteNote(id, user.token)
        const newNotes = notes.filter(arrayNote => String(arrayNote._id) !== String(id))
        setNotes(newNotes)
    }

    const updateNote = data => {
        const editedNote = {
            title: data.editedTitle,
            content: data.editedContent,
            important: data.editedImportant
        }
        noteServices.update(note._id, editedNote, user.token).then(response => {

            const newNotes = notes.map(noteIn =>
                noteIn._id === note._id ? response : noteIn
            );
            setNotes(newNotes)
        })
        setIsEdit(false)
    }

    const Category = Categories.find(category => category.category === note.category)

    return (
        <li className={`size-72 shadow-2xl relative rounded-md p-6 flex items-center ${Category.style} text-white flex-col justify-between`}>
            <span title={Category.category} className="absolute bottom-5 right-4"><Category.icon /></span>
            {!isEdit && <div className="flex flex-col gap-6 items-center">
                <h1 className="text-xl underline underline-offset-4">{note.title}</h1>
                <div className="text-sm pr-4 overflow-y-auto w-full min-h-[60px] font-[Kalam]">{note.content}</div>
                <span>{note.important === true ? "IMPORTANT!" : "Not Important"}</span>
            </div>}
            {isEdit && <form onSubmit={handleSubmit(updateNote)} className="flex flex-col w-full gap-6 items-center">
                <input type="text" placeholder="Title" {...register("editedTitle", {
                    required: true
                })} className="text-black p-1" />
                {errors?.editedTitle?.type === "required" && <span className="text-[10px] left-36 top-9 text-red-700 absolute">The Title is required</span>}
                <textarea placeholder="Content" style={{ resize: "none" }} {...register("editedContent", {
                    required: true
                })} className="text-black p-1 w-full h-[90px] " />
                {errors?.editedContent?.type === "required" && <span className="text-[10px] absolute bottom-32 left-[136px] text-red-700">The Content is required</span>}
                <div className="flex flex-row gap-4 items-center">
                    <select {...register("editedImportant")} className="text-black">
                        <option value={false}>Not important</option>
                        <option value={true}>Important</option>
                    </select>
                    <button type="submit"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg></button>
                </div>

            </form>}
            <div className="flex items-center gap-4">
                <button onClick={() => setIsEdit(!isEdit)}>
                    {!isEdit ? (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                    </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>)}
                </button>
                <button onClick={() => DeleteThis(note._id)}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                </svg></button>
            </div>
        </li>
    )
}