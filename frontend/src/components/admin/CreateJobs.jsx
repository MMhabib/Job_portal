import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const CreateJobs = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const { companies } = useSelector(store => store.company);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });

    }
    const handleSelectCompanyChange = (value) => {
        const selectedCompany = companies.find(company => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany._id });
    }
    const handleSelectChange = (name, value) => {
        setInput({ ...input, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`https://job-portal-server-u5ru.onrender.com/api/v1/job/postjob`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }); 
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
        setInput({
            title: "",
            description: "",
            requirements: "",
            salary: "",
            location: "",
            jobType: "",
            experience: "",
            position: 0,
            companyId: ""
        })
    }
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <div className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>

                        <div>
                            <Label>Salary <span className='text-xs text-gray-500'>(in LPA)</span></Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Select onValueChange={(value) => handleSelectChange('location', value)} onChange={changeEventHandler} value={input.location}>
                                <SelectTrigger className="w-full focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                                    <SelectValue placeholder="Select a Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Dhaka">Dhaka</SelectItem>
                                        <SelectItem value="Chittagong">Chittagong</SelectItem>
                                        <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                                        <SelectItem value="Khulna">Khulna</SelectItem>
                                        <SelectItem value="Sylhet">Sylhet</SelectItem>
                                        <SelectItem value="Barisal">Barisal</SelectItem>
                                        <SelectItem value="Rangpur">Rangpur</SelectItem>
                                        <SelectItem value="Mymensingh">Mymensingh</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Job Type</Label>
                             <Select onValueChange={(value) => handleSelectChange('jobType', value)} value={input.jobType}>
                                <SelectTrigger className="w-full focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                                    <SelectValue placeholder="Select Job Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Experience Level <span className='text-xs text-gray-500'>(in years)</span></Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>No of Position</Label>
                            <Input
                                type='number'
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        {
                            companies.length !== 0 && (
                                <Select onValueChange={handleSelectCompanyChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                companies && companies.map((company) => {
                                                    return (
                                                        <SelectItem
                                                            key={company?._id}
                                                            value={company?.name.toLowerCase()}
                                                        >
                                                            {company?.name}
                                                        </SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )
                        }

                    </div>
                    <Button onClick={submitHandler} disabled={companies?.length === 0 ? true : false} className='w-full mt-4'>Post New Job</Button>
                    {
                        companies.length === 0 && <p className='text-red-600 text-xs font-bold text-center my-3'>*Please register a company first, before posting a jobs</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateJobs