import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Effortless Launch',
    description:
      'Easily deploy high-performance websites designed with Next.js and React. Experience seamless launches with robust solutions tailored for your business needs.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Secure by Design',
    description:
      'Ensure your website’s safety with integrated SSL encryption. Build trust with your users through a secure and professional digital presence.',
    icon: LockClosedIcon,
  },
  {
    name: 'Streamlined Workflows',
    description:
      'Simplify processes and improve performance with expertly crafted front-end systems. Efficiency meets elegance in every website I create.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Stay Protected',
    description:
      'Advanced front-end development ensures your website is secure and optimized. Protect your data while offering a smooth user experience.',
    icon: FingerPrintIcon,
  },
]

export default function Example() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-slate-50">Build Faster, Rank Higher</h2>
          <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-balance">
          Everything you need to create and optimize your website.
          </p>
          <div className='rtl'>
          <p className="mt-6 text-lg/8 text-slate-50">
          From modern front-end design with Next.js and React to professional SEO strategies, I deliver fast, user-friendly websites that drive traffic and boost your online visibility.
           Let’s turn your vision into a high-performing digital presence.
          </p>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-white">
                  <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-emerald-400">
                    <feature.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-white">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
