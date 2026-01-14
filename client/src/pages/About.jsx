const About = () => {
  return (
    <div className="bg-gray-50">
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-3">About DevCamper</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              We help people find the right bootcamp and launch their tech career.
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              DevCamper was built by developers who know the impact the right program can make.
              We curate bootcamps, publish transparent reviews, and provide tools for admins to keep
              information accurate and up to date.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-1">Quality-first listings</h3>
                <p>Every bootcamp profile includes outcomes, pricing, and verified reviews.</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-1">Community powered</h3>
                <p>Students and alumni share honest feedback to help others choose confidently.</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-1">Built for admins</h3>
                <p>Admins manage bootcamps, courses, users, and reviews in a single dashboard.</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-1">Future focused</h3>
                <p>We continually add features to make career changes simpler and faster.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white p-10 h-full flex flex-col justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide font-semibold opacity-80">Why DevCamper</p>
                <h2 className="text-3xl font-bold mt-2 mb-4">Curated, trusted, focused</h2>
                <p className="text-white/90 text-lg mb-6">
                  Built for people changing careers and the admins who keep bootcamp data accurate.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-2xl font-bold">200+</p>
                  <p className="opacity-80">bootcamps tracked</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-2xl font-bold">5k+</p>
                  <p className="opacity-80">reviews served</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="opacity-80">admin updates</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-2xl font-bold">Global</p>
                  <p className="opacity-80">community reach</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white text-primary-700 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold">
              Trusted by learners worldwide
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our mission</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We believe breaking into tech should be clear, transparent, and fair. DevCamper brings
            together program data, real reviews, and admin-managed content so future developers can
            decide with confidence. Whether you are comparing locations, costs, or outcomes, we aim
            to make the path obvious.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Curated data</h3>
              <p>Up-to-date bootcamp info with clear pricing, formats, and focus areas.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Verified voices</h3>
              <p>Reviews from real students and alumni—no fluff, just useful signal.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Actionable tools</h3>
              <p>Favorites, comparisons, and admin workflows keep the platform organized.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
