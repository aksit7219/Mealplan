import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";

const MenuCard = ({ title, imgSrc, onEdit, isEnabled, categories, description }) => {
  return (
    <>

      <Card className="max-w-[24rem] overflow-hidden">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 rounded-none"
        >
          <img
            src={imgSrc}
            alt="ui/ux review check"
            className='h-[256px] w-[384px] object-cover object-center'
          />
        </CardHeader>
        <CardBody>
          <Typography variant="h4" color="blue-gray">
            {title}
          </Typography>
          <div className="flex justify-start gap-2 my-4">

            {categories.map((cat, index) => (
              <span key={index} className='text-sm px-2 py-1 bg-blue-gray-100 text-blue-gray-900 border-blue-gray-900 border-y border-x rounded-full'>{cat}</span>

            ))}
          </div>
          <Typography variant="lead" color="gray" className="my-3 font-normal">
            {description}
          </Typography>
          <Button color="light-blue" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </CardBody>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center -space-x-3">
            <span className={`${isEnabled === "enable" ? "bg-green-100 text-green-500 dark:text-green-400 border-x border-y border-green-800" : "bg-red-100 text-red-800 dark:text-red-400 border-x border-y border-red-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700`}>{isEnabled}</span>
          </div>
        </CardFooter>
      </Card>
    </>
  )
};

export default MenuCard;

