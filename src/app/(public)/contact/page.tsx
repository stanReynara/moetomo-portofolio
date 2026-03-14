export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-1/2 border p-4">
        <input type="text" className="input rounded-2xl w-full" placeholder="Name / Alias" />
        <input type="text" className="input rounded-2xl w-full" placeholder="Email" />
        <input type="text" className="input rounded-2xl w-full" placeholder="Subject" />
        <textarea className="textarea rounded-2xl w-full" placeholder="Message"></textarea>

        <button className="btn btn-primary mt-4">Submit</button>
      </fieldset>
    </div>
  );
}