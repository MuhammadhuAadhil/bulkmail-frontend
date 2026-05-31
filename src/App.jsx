import { useState } from "react";
import axios from "axios";
import "./App.css";
import * as XLSX from "xlsx";
import logo from "./assets/b.jpeg";

function App() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  // Handle message input
  function handleMsg(e) {
    setMsg(e.target.value);
  }

  // Validate email (basic)
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  // Handle file upload
  function handleFile(event) {
    const file = event.target.files[0];

    if (!file) return;

    // Allow only Excel files
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      alert("Please upload a valid Excel file");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const sheetData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

      const emails = sheetData.flat().filter((email) => isValidEmail(email));

      // Remove duplicates
      const uniqueEmails = [...new Set(emails)];

      setEmailList(uniqueEmails);
    };

    reader.readAsArrayBuffer(file);
  }

  // Send emails
  async function send() {
    if (!msg.trim()) {
      alert("Message is empty");
      return;
    }

    if (emailList.length === 0) {
      alert("Email list is empty");
      return;
    }

    try {
      setStatus(true);

      await axios.post("https://bulkmail-backend-r0sf.onrender.com/sendemail", {
        msg,
        emailList,
      });

      alert("Emails sent successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Error sending emails ❌");
    } finally {
      setStatus(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf7ff] text-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-fuchsia-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Bulk Mail logo"
              className="h-10 w-10 rounded-xl object-cover shadow-sm"
            />
            <div>
              <span className="block text-base font-bold leading-tight tracking-tight">
                Bulk Mail
              </span>
              <span className="hidden text-xs font-medium text-fuchsia-600 sm:block">
                Campaign console
              </span>
            </div>
          </a>

          <div className="hidden items-center gap-1 rounded-full border border-fuchsia-100 bg-fuchsia-50 p-1 text-sm font-semibold text-slate-700 md:flex">
            <a
              href="#compose"
              className="rounded-full px-4 py-2 transition-colors hover:bg-white hover:text-fuchsia-700 hover:shadow-sm"
            >
              Compose
            </a>
            <a
              href="#upload"
              className="rounded-full px-4 py-2 transition-colors hover:bg-white hover:text-fuchsia-700 hover:shadow-sm"
            >
              Upload
            </a>
            <a
              href="#send"
              className="rounded-full px-4 py-2 transition-colors hover:bg-white hover:text-fuchsia-700 hover:shadow-sm"
            >
              Send
            </a>
          </div>

          <button
            onClick={send}
            disabled={status}
            className="rounded-lg bg-gradient-to-r from-fuchsia-600 to-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-fuchsia-200 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400"
          >
            {status ? "Sending" : "Get Started"}
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="grid gap-6 border-b border-fuchsia-100 pb-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-fuchsia-600">
              Email workflow
            </p>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Send bulk emails with a clean, focused console.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Compose your message, upload an Excel sheet, validate recipients,
              and send from one sharp workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-fuchsia-100 bg-white p-4 shadow-sm shadow-fuchsia-100/70">
              <p className="text-sm font-semibold text-slate-500">Recipients</p>
              <p className="mt-2 text-3xl font-black text-fuchsia-700">
                {emailList.length}
              </p>
            </div>
            <div className="rounded-xl border border-violet-100 bg-white p-4 shadow-sm shadow-violet-100/70">
              <p className="text-sm font-semibold text-slate-500">Status</p>
              <p className="mt-2 text-lg font-bold text-violet-700">
                {status ? "Sending" : "Ready"}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="grid gap-6 py-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Compose */}
          <div
            id="compose"
            className="rounded-2xl border border-fuchsia-100 bg-white p-5 shadow-sm shadow-fuchsia-100/70 sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-950">
                  Compose Message
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Write the content that will be sent to every uploaded email.
                </p>
              </div>
              <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-bold text-fuchsia-700">
                Step 01
              </span>
            </div>

            <textarea
              onChange={handleMsg}
              value={msg}
              className="h-72 w-full resize-none rounded-xl border border-fuchsia-100 bg-fuchsia-50/40 p-4 text-sm leading-6 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-fuchsia-500 focus:bg-white focus:ring-4 focus:ring-fuchsia-100"
              placeholder="Write your email content here..."
            ></textarea>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>{msg.trim().length} characters</span>
              <span>Excel upload supports .xlsx and .xls</span>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Upload */}
            <label
              id="upload"
              className="relative flex min-h-72 cursor-pointer flex-col justify-center rounded-2xl border-2 border-dashed border-fuchsia-300 bg-white p-6 text-center shadow-sm shadow-fuchsia-100/70 transition-colors hover:border-violet-500 hover:bg-fuchsia-50/60"
            >
              <input
                type="file"
                onChange={handleFile}
                className="absolute inset-0 cursor-pointer opacity-0"
              />

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-600 to-violet-700 text-white shadow-lg shadow-fuchsia-200">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0 0l-3-3m3 3l3-3m-6-9h6a2 2 0 012 2v4H4V7a2 2 0 012-2h6z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-black tracking-tight text-slate-950">
                Upload Recipient Sheet
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Click to choose your Excel file. Duplicate and invalid emails
                are filtered before sending.
              </p>
              <p className="mt-5 text-sm font-bold text-fuchsia-700">
                {emailList.length} valid emails loaded
              </p>
            </label>

            {/* Send Summary */}
            <div
              id="send"
              className="rounded-2xl border border-violet-800 bg-gradient-to-br from-[#2b064e] via-[#5b1184] to-[#c0268a] p-6 text-white shadow-xl shadow-fuchsia-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight">
                    Ready to Send
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Review your message and recipient count before starting the
                    bulk email process.
                  </p>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-pink-100">
                  Step 03
                </span>
              </div>

              <button
                onClick={send}
                disabled={status}
                className="mt-6 w-full rounded-xl bg-white px-5 py-4 text-sm font-black text-violet-900 shadow-sm transition-colors hover:bg-pink-50 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              >
                {status ? "Sending Emails..." : "Send Emails"}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-fuchsia-100 py-6 text-center text-sm font-medium text-slate-500">
        © 2025 Bulk Mail • Secure & Fast
      </footer>
    </div>
  );
}

export default App;
