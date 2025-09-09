"use client";
import { useState } from "react";
import Image from "next/image";




export default function ApplicationPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        expectedSalary: "",
        availableFrom: "",
        linkedin: "",
        whyNeon: "",
        howHeard: "",
        extraInfo: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        alert("Application submitted!");
    };

    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Logo */}
            <div className="flex  items-center px-45 pt-8 pb-2">
                <Image
                    src="/neon-logo.png"
                    alt="Neon Logo"
                    width={200}
                    height={80}
                    priority
                />
            </div>
            {/* Header */}
            <header className="bg-blue-400 p-4 text-white">
                <div className="w-4/5 mx-auto flex justify-between items-center">
                    <a href="/Jobs" className="text-sm underline">
                        See all jobs
                    </a>
                </div>
            </header>

            {/* Job Title */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-blue-400">
                    Legal Trainees | Research Assistants Venture Capital
                </h2>
                <p className="text-gray-600 mt-1">Temporary, Part-time · Berlin</p>

                <hr className="my-6" />

                <h3 className="text-lg font-semibold mb-4 text-blue-400">
                    YOUR APPLICATION!
                </h3>

                {/* Application Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First"
                            className="border p-2 rounded w-full"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last"
                            className="border p-2 rounded w-full"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="yourmail@domain.com"
                            className="border p-2 rounded w-full"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+49 176 123 4455"
                            className="border p-2 rounded w-full"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Expected Salary & Available From */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="expectedSalary"
                            placeholder="Expected salary"
                            className="border p-2 rounded w-full"
                            value={formData.expectedSalary}
                            onChange={handleChange}
                        />
                        <input
                            type="date"
                            name="availableFrom"
                            className="border p-2 rounded w-full"
                            value={formData.availableFrom}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* LinkedIn & Why NEON */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="linkedin"
                            placeholder="LinkedIn"
                            className="border p-2 rounded w-full"
                            value={formData.linkedin}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="whyNeon"
                            placeholder="Warum passt Du zu NEON?"
                            className="border p-2 rounded w-full"
                            value={formData.whyNeon}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* How heard about us & Extra Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            name="howHeard"
                            className="border p-2 rounded w-full"
                            value={formData.howHeard}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Please select …</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="website">Website</option>
                            <option value="friend">Friend / Colleague</option>
                            <option value="other">Other</option>
                        </select>
                        <input
                            type="text"
                            name="extraInfo"
                            placeholder="Platz für mehr Infos..."
                            className="border p-2 rounded w-full"
                            value={formData.extraInfo}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Upload Documents */}
                    <div>
                        <h4 className="font-semibold mb-2">Documents</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Please upload your CV, recent certificates as well as a brief cover letter (in total max. 20 MB).
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="border-2 border-dashed p-6 rounded text-center cursor-pointer">
                                CV *
                                <input type="file" className="hidden" required />
                            </label>
                            <label className="border-2 border-dashed p-6 rounded text-center cursor-pointer">
                                Cover letter *
                                <input type="file" className="hidden" required />
                            </label>
                            <label className="border-2 border-dashed p-6 rounded text-center cursor-pointer">
                                Employment reference *
                                <input type="file" className="hidden" required />
                            </label>
                            <label className="border-2 border-dashed p-6 rounded text-center cursor-pointer">
                                Certificate
                                <input type="file" className="hidden" />
                            </label>
                            <label className="border-2 border-dashed p-6 rounded text-center cursor-pointer md:col-span-2">
                                Other
                                <input type="file" className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center space-x-4 mt-6">
                        <button
                            type="submit"
                            className="bg-blue-400 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
                        >
                            Send application
                        </button>
                        <button
                            type="button"
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded shadow hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <footer className="text-center text-sm text-gray-500 mt-12 py-6 border-t">
                Powered by Personio | personio.com <br />
                Data privacy statement | Legal Notice
            </footer>
        </div>
    );
}