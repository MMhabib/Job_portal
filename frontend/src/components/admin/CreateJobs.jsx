import  { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';

const CreateJobs = () => {
  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experience: '',
    position: 0,
    companyId: '',
  });

  const { id } = useParams();
  const { companies } = useSelector((store) => store.company);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch job data if editing
  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        try {
          dispatch(setLoading(true));
          const res = await axios.get(`http://localhost:5000/api/v1/job/${id}`, {
            withCredentials: true,
          });
          if (res.data.success) {
            const job = res.data.job;
            setInput({
              title: job.title || '',
              description: job.description || '',
              requirements: job.requirements || '',
              salary: job.salary || '',
              location: job.location || '',
              jobType: job.jobType || '',
              experience: job.experience || '',
              position: job.position || 0,
              companyId: job.company?._id || '',
            });
          }
        } catch (err) {
          toast.error('Failed to fetch job data');
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchJob();
    }
  }, [id, dispatch]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    const selectedCompany = companies.find(
      (company) => company._id === value
    );
    if (selectedCompany) {
      setInput({ ...input, companyId: selectedCompany._id });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));

      const endpoint = id
        ? `http://localhost:5000/api/v1/job/${id}`
        : `http://localhost:5000/api/v1/job`;
      const method = id ? 'put' : 'post';

      const res = await axios[method](endpoint, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      dispatch(setLoading(false));
    }

    if (!id) {
      setInput({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        jobType: '',
        experience: '',
        position: 0,
        companyId: '',
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md grid grid-cols-2 gap-4"
        >
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={input.title}
              onChange={changeEventHandler}
              required
              className="my-1"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              type="text"
              name="description"
              value={input.description}
              onChange={changeEventHandler}
              required
              className="my-1"
            />
          </div>
          <div>
            <Label>Requirements</Label>
            <Input
              type="text"
              name="requirements"
              value={input.requirements}
              onChange={changeEventHandler}
              className="my-1"
            />
          </div>
          <div>
            <Label>
              Salary <span className="text-xs text-gray-500">(in LPA)</span>
            </Label>
            <Input
              type="number"
              name="salary"
              value={input.salary}
              onChange={changeEventHandler}
              required
              className="my-1"
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              type="text"
              name="location"
              value={input.location}
              onChange={changeEventHandler}
              required
              className="my-1"
            />
          </div>
          <div>
            <Label>Job Type</Label>
            <Input
              type="text"
              name="jobType"
              value={input.jobType}
              onChange={changeEventHandler}
              required
              className="my-1"
            />
          </div>
          <div>
            <Label>
              Experience Level <span className="text-xs text-gray-500">(in
              years)</span>
            </Label>
            <Input
              type="number"
              name="experience"
              value={input.experience}
              onChange={changeEventHandler}
              required
              className="my-1"
            />
          </div>
          <div>
            <Label>No of Positions</Label>
            <Input
              type="number"
              name="position"
              value={input.position}
              onChange={changeEventHandler}
              required
              className="my-1"
            />
          </div>
          <div>
            <Label>Select Company</Label>
            <Select
              onValueChange={handleSelectChange}
              value={input.companyId}
              required
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {companies.map((company) => (
                    <SelectItem key={company._id} value={company._id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Button
              type="submit"
              disabled={companies.length === 0}
              className="w-full mt-4"
            >
              {id ? 'Update Job' : 'Post New Job'}
            </Button>
            {companies.length === 0 && (
              <p className="text-red-600 text-xs font-bold text-center my-3">
                *Please register a company first, before posting a job
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobs;
